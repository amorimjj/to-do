import { ReactNode } from 'react';

type FilterButtonProps = {
  children: ReactNode;
  onClick: () => void;
  selected: boolean;
};

export const FilterButton = ({
  children,
  onClick,
  selected
}: FilterButtonProps) => (
  <button
    data-selected={selected}
    type="button"
    onClick={onClick}
    className="group pb-4 text-sm font-bold capitalize transition-all relative cursor-pointer data-[selected=false]:text-zinc-400 data-[selected=false]:hover:text-zinc-600"
  >
    {children}
    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 group-data-[selected=false]:hidden"></div>
  </button>
);
