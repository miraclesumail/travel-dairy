/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-11-18 22:48:20
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-11-18 22:59:31
 * @FilePath: /travel-dairy/src/i18n/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client';
import { useParams } from 'next/navigation';
import i18next from 'i18next';
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getOptions } from './utils';
import { Namespace } from './types';

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
  .init({
    ...getOptions(),
    returnNull: false,
    lng: undefined, // let detect the language on client side
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
  });

export function useT(ns?: Namespace) {
  const params = useParams();
  const lang = 'zh-CN' || String(params?.lang);
  console.log(lang, '0----');
  if (i18next.resolvedLanguage !== lang) i18next.changeLanguage(lang);

  return useTranslationOrg(ns);
}
