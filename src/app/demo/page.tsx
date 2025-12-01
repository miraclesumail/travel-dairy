/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-11-04 22:53:22
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-12-01 21:34:51
 * @FilePath: /travel-dairy/src/app/demo/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client';
import { Button } from '@/components/ui/button';
import a, { bb, MyPackageExports, FN } from '@miracle_sumail/my-antd';
import b from '@miracle_sumail/my-antd/es';
import c from '@miracle_sumail/my-antd/lib';
import { Select, Option, Option2 } from '@miracle_sumail/test-demo';
import { showDemo } from '@/app/utils/ui/showModal';
import styles from './style.module.scss';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// export type User = { roles: Role[]; id: string }

// type Role = keyof typeof ROLES
// type Permission = (typeof ROLES)[Role][number]

// const ROLES = {
//   admin: [
//     "view:comments",
//     "create:comments",
//     "update:comments",
//     "delete:comments",
//   ],
//   moderator: ["view:comments", "create:comments", "delete:comments"],
//   user: ["view:comments", "create:comments"],
// } as const

// export function hasPermission(user: User, permission: Permission) {
//   return user.roles.some(role =>
//     (ROLES[role] as readonly Permission[]).includes(permission)
//   )
// }

// // USAGE:
// const user: User = { id: "1", roles: ["user"] }

// // Can create a comment
// hasPermission(user, "create:comments")

// // Can view all comments
// hasPermission(user, "view:comments")

const Page = () => {
  const options: Option[] = [
    // Use the exported Option type
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
  ];

  const router = useRouter();
  // useEffect(() => {
  //    return () => {
  //     track(TrackType.PAGE_STAY, {
  //       url: 'pathname',
  //       duration: 999,
  //       userId: '888',
  //       time: '2022-11-11',
  //     });
  //    }
  // }, [])

  console.log(a.alert(), 'cnmdmdmd');
  console.log(a.anchor(), 'cnmdmdmd');
  console.log(b.test(), 'hahahah111');
  console.log(c.test(), 'hahahah222');

  return (
    <div>
      <Button variant={'default'} variantType={'axiba'} onClick={() => router.push('/calendar')}>
        Click me
      </Button>
      <Select options={options} placeholder='Choose a role' onChange={(val) => alert(`You selected: ${val}`)} />
      {/* <svg xmlns='http://www.w3.org/2000/svg' viewBox='-5 -4.064 38 38'>
        <path
          className={styles.path}
          d='M 0 0 L 8.872 -0.024 L 0.103 7.084 L 3.85 -3.964 L 8.022 6.89 L -0.013 0.015'
          stroke='orange'
          strokeWidth='0.1'
          fill='none'
        />
      </svg> */}

      <button data-track='comment' data-content={`${JSON.stringify({ description: 'this is a' })}`}>
        comment
      </button>

      <button data-track='checkout' data-content={`${JSON.stringify({ productId: 'dhhdgf88', quantity: 8 })}`}>
        checkout
      </button>

      <svg viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg' width={800} height={800}>
        <path
          className={styles.path}
          d='M140 20C73 20 20 74 20 140c0 135 136 170 228 303 88-132 229-173 229-303 0-66-54-120-120-120-48 0-90 28-109 69-19-41-60-69-108-69z'
          stroke='orange'
          strokeWidth='5'
          fill='none'
        />
      </svg>
    </div>
  );
};

export default Page;

type Comment = {
  id: string;
  body: string;
  authorId: string;
  createdAt: Date;
};

type Todo = {
  id: string;
  title: string;
  userId: string;
  completed: boolean;
  invitedUsers: string[];
};

type Role = 'admin' | 'moderator' | 'user';
type User = { blockedBy: string[]; roles: Role[]; id: string };

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: User, data: Permissions[Key]['dataType']) => boolean);

type RolesWithPermissions = {
  [R in Role]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]['action']]: PermissionCheck<Key>;
    }>;
  }>;
};

type Permissions = {
  comments: {
    dataType: Comment;
    action: 'view' | 'create' | 'update';
  };
  todos: {
    // Can do something like Pick<Todo, "userId"> to get just the rows you use
    dataType: Todo;
    action: 'view' | 'create' | 'update' | 'delete';
  };
};

const ROLES = {
  admin: {
    comments: {
      view: true,
      create: true,
      update: true,
    },
    todos: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
  },
  moderator: {
    comments: {
      view: true,
      create: true,
      update: true,
    },
    todos: {
      view: true,
      create: true,
      update: true,
      delete: (user, todo) => todo.completed,
    },
  },
  user: {
    comments: {
      view: (user, comment) => !user.blockedBy.includes(comment.authorId),
      create: true,
      update: (user, comment) => comment.authorId === user.id,
    },
    todos: {
      view: (user, todo) => !user.blockedBy.includes(todo.userId),
      create: true,
      update: (user, todo) => todo.userId === user.id || todo.invitedUsers.includes(user.id),
      delete: (user, todo) => (todo.userId === user.id || todo.invitedUsers.includes(user.id)) && todo.completed,
    },
  },
} as const satisfies RolesWithPermissions;

function hasPermission<Resource extends keyof Permissions>(
  user: User,
  resource: Resource,
  action: Permissions[Resource]['action'],
  data?: Permissions[Resource]['dataType']
) {
  return user.roles.some((role) => {
    const permission = (ROLES as RolesWithPermissions)[role][resource]?.[action];
    if (permission == null) return false;

    if (typeof permission === 'boolean') return permission;
    return data != null && permission(user, data);
  });
}

// USAGE:
const user: User = { blockedBy: ['2'], id: '1', roles: ['user'] };
const todo: Todo = {
  completed: false,
  id: '3',
  invitedUsers: [],
  title: 'Test Todo',
  userId: '1',
};

// Can create a comment
hasPermission(user, 'comments', 'create');

// Can view the `todo` Todo
hasPermission(user, 'todos', 'view', todo);

// Can view all todos
hasPermission(user, 'todos', 'view');


