import { create } from 'zustand';

type State = {
  age: number;
  name: string;
};

type Action = {
  increase: () => void;
};

const initState: State = {
  age: 18,
  name: 'axiba',
};

export const useTeststore = create<State & Action>((set, get) => ({
  ...initState,
  increase: () => set((state) => ({ ...state, age: state.age + 1 })),
  changeName: (name: string) => {
    console.log(get().age);
    set({ name });
  },
}));

useTeststore.subscribe((state, prev) => {
  console.log('now is', state);
  console.log('prev is', prev);
});
