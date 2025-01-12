
import { importDirectory, cleanupSVG, runSVGO, parseColors, isEmptyColor } from '@iconify/tools'
import * as fs from 'fs'
import { hardcore } from './config/hardcore.js'

const svgFilesFolder = './svg-files'
const iconSetFile = './output/icon.json'
const iconListFile = './output/icon-list.json'
const setPrefix = 'cnx'

;(async () => {
  // Import icons
  const iconSet = await importDirectory(svgFilesFolder, {
    prefix: setPrefix,
    includeSubDirs: true,
  })

  // Validate, clean up, fix palette and optimism
  iconSet.forEach((name, type) => {
    if (type !== 'icon') {
      return
    }

    const svg = iconSet.toSVG(name)
    if (!svg) {
      // Invalid icon
      iconSet.remove(name)
      return
    }

    // Clean up and optimise icons
    try {
      // Clean up icon code
      cleanupSVG(svg)

      // Assume icon is monotone: replace color with currentColor, add if missing
      // If icon is not monotone, remove this code
      if (!hardcore.includes(name)) {
        parseColors(svg, {
          defaultColor: 'currentColor',
          callback: (attr, colorStr, color) => {
            if (!color) return colorStr
            if (isEmptyColor(color)) return color
            return 'currentColor'
          },
        })
      }

      // Optimise
      runSVGO(svg)
    } catch (err) {
      // Invalid icon
      console.error(`Error parsing ${name}:`, err)
      iconSet.remove(name)
      return
    }

    // Update icon
    iconSet.fromSVG(name, svg)
  })

  // export icon set
  //   console.log(iconSet.export())
  const json = iconSet.export()

  // Write to file
  fs.writeFileSync(iconSetFile, JSON.stringify(json, null, 2))

  // write all icon classNames to file
  const classNames = Object.keys(json.icons).map((name) => `icon-[${json.prefix}--${name}]`)

  fs.writeFileSync(iconListFile, JSON.stringify(classNames, null, 2))
})()
