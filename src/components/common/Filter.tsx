import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export interface FilterProps {
  onApply?: (filters: { selectedTag: string; org: string; maintainer: string; onlyFeatured: boolean }) => void;
}

export function Filter({ onApply }: FilterProps) {
  const [selectedTag, setSelectedTag] = useState('all');
  const [org, setOrg] = useState('');
  const [maintainer, setMaintainer] = useState('');
  const [onlyFeatured, setOnlyFeatured] = useState(false);

  const handleApply = () => {
    if (onApply) {
      onApply({ selectedTag: selectedTag === 'all' ? '' : selectedTag, org, maintainer, onlyFeatured });
    }
  };

  return (
    <Card className="space-y-4 p-4 border-none shadow-none">
      <div className="space-y-2">
        <Label htmlFor="tag">Tag</Label>
        <Select value={selectedTag} onValueChange={setSelectedTag}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="frontend">Frontend</SelectItem>
            <SelectItem value="backend">Backend</SelectItem>
            <SelectItem value="devops">DevOps</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="org">Organization</Label>
        <Input id="org" value={org} onChange={e => setOrg(e.target.value)} placeholder="e.g. vercel" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="maintainer">Maintainer</Label>
        <Input id="maintainer" value={maintainer} onChange={e => setMaintainer(e.target.value)} placeholder="e.g. johndoe" />
      </div>
      <div className="flex items-center space-x-2">
        <input
          id="featured"
          type="checkbox"
          checked={onlyFeatured}
          onChange={e => setOnlyFeatured(e.target.checked)}
          className="accent-primary h-4 w-4 rounded border"
        />
        <Label htmlFor="featured">Only show featured</Label>
      </div>
      <Button className="w-full mt-2" onClick={handleApply}>
        Apply Filters
      </Button>
    </Card>
  );
}
