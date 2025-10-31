import { PREDEFINED_TAGS } from '@/lib/constants';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * @typedef {Object} FilterProps
 * @property {string} selectedTag - The currently selected tag for filtering.
 * @property {string} org - The current organization filter value.
 * @property {string} maintainer - The current maintainer filter value.
 * @property {boolean} onlyFeatured - The current "only featured" filter value.
 * @property {(tag: string) => void} onTagChange - Callback function to update the selected tag.
 * @property {(org: string) => void} onOrgChange - Callback function to update the organization filter.
 * @property {(maintainer: string) => void} onMaintainerChange - Callback function to update the maintainer filter.
 * @property {(onlyFeatured: boolean) => void} onFeaturedChange - Callback function to update the "only featured" filter.
 * @property {() => void} [onApply] - Optional callback function to be called when the "Apply Filters" button is clicked.
 */
export interface FilterProps {
  selectedTag: string;
  org: string;
  maintainer: string;
  onlyFeatured: boolean;
  onTagChange: (tag: string) => void;
  onOrgChange: (org: string) => void;
  onMaintainerChange: (maintainer: string) => void;
  onFeaturedChange: (onlyFeatured: boolean) => void;
  onApply?: () => void;
}

/**
 * Filter component for selecting tags, organization, maintainer, and featured status.
 * This is a controlled component, meaning its state is managed by its parent.
 *
 * @param {FilterProps} props - The props for the Filter component.
 * @returns {JSX.Element} The rendered Filter component.
 */
export function Filter({
  selectedTag,
  org,
  maintainer,
  onlyFeatured,
  onTagChange,
  onOrgChange,
  onMaintainerChange,
  onFeaturedChange,
  onApply
}: FilterProps) {
  const tagOptions = [
    { value: 'all', label: 'All' },
    ...PREDEFINED_TAGS.map(tag => ({ value: tag, label: tag.charAt(0).toUpperCase() + tag.slice(1) }))
  ];

  return (
    <Card className="space-y-4 p-4 border-none shadow-none bg-transparent">
      <div className="space-y-2">
        <Label htmlFor="tag">Tag</Label>
        <Select value={selectedTag} onValueChange={onTagChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent className='bg-black/5 backdrop-blur-sm shadow-inner'>
            {tagOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="org">Organization</Label>
        <Input id="org" value={org} onChange={e => onOrgChange(e.target.value)} placeholder="e.g. vercel" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="maintainer">Maintainer</Label>
        <Input id="maintainer" value={maintainer} onChange={e => onMaintainerChange(e.target.value)} placeholder="e.g. johndoe" />
      </div>
      <div className="flex items-center space-x-2">
        <input
          id="featured"
          type="checkbox"
          checked={onlyFeatured}
          onChange={e => onFeaturedChange(e.target.checked)}
          className="accent-primary h-4 w-4 rounded border"
        />
        <Label htmlFor="featured">Only show featured</Label>
      </div>
      <Button className="w-full mt-2" onClick={onApply}>
        Apply Filters
      </Button>
    </Card>
  );
}
