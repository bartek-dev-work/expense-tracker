import { Bus, Music, Receipt, Tag, Utensils, type LucideIcon } from 'lucide-react';
import { getCategory } from '@/lib/categories';
import type { CategoryId } from '@/types/expense';

const ICONS: Record<CategoryId, LucideIcon> = {
  food: Utensils,
  transport: Bus,
  bills: Receipt,
  fun: Music,
  other: Tag,
};

interface CategoryBadgeProps {
  category: CategoryId;
  size?: 'sm' | 'md' | 'lg';
}

export function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps): JSX.Element {
  const cat = getCategory(category);
  const Icon = ICONS[category];
  const sizes = {
    sm: { box: 'w-7 h-7', icon: 12 },
    md: { box: 'w-10 h-10', icon: 16 },
    lg: { box: 'w-12 h-12', icon: 18 },
  } as const;
  const { box, icon } = sizes[size];

  return (
    <span
      role="img"
      aria-label={cat.label}
      className={`${box} shrink-0 rounded-full flex items-center justify-center text-white`}
      style={{ background: cat.color }}
    >
      <Icon size={icon} strokeWidth={2.4} aria-hidden="true" />
    </span>
  );
}
