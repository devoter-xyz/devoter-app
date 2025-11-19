import { PREDEFINED_TAGS } from '@/lib/constants';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from 'lucide-react';

export interface FilterProps {
  onApply?: (filters: {
    selectedTags: string[];
    org: string;
    maintainer: string;
    onlyFeatured: boolean;
    startDate: string;
    endDate: string;
    minVotes: number | undefined;
    maxVotes: number | undefined;
  }) => void;
  initialFilters?: {
    selectedTags?: string[];
    org?: string;
    maintainer?: string;
    onlyFeatured?: boolean;
    startDate?: string;
    endDate?: string;
    minVotes?: number;
    maxVotes?: number;
  };
}

export function Filter({ onApply, initialFilters }: FilterProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(initialFilters?.selectedTags || []);
  const [org, setOrg] = useState(initialFilters?.org || '');
  const [maintainer, setMaintainer] = useState(initialFilters?.maintainer || '');
  const [onlyFeatured, setOnlyFeatured] = useState(initialFilters?.onlyFeatured || false);
  const [startDate, setStartDate] = useState(initialFilters?.startDate || '');
  const [endDate, setEndDate] = useState(initialFilters?.endDate || '');
  const [minVotes, setMinVotes] = useState(initialFilters?.minVotes?.toString() ?? '');
  const [maxVotes, setMaxVotes] = useState(initialFilters?.maxVotes?.toString() ?? '');
  const [startDateError, setStartDateError] = useState('');
  const [endDateError, setEndDateError] = useState('');
  const [minVotesError, setMinVotesError] = useState('');
  const [maxVotesError, setMaxVotesError] = useState('');

  useEffect(() => {
    setSelectedTags(initialFilters?.selectedTags ?? []);
    setOrg(initialFilters?.org ?? '');
    setMaintainer(initialFilters?.maintainer ?? '');
    setOnlyFeatured(initialFilters?.onlyFeatured ?? false);
    setStartDate(initialFilters?.startDate ?? '');
    setEndDate(initialFilters?.endDate ?? '');
    setMinVotes(initialFilters?.minVotes?.toString() ?? '');
    setMaxVotes(initialFilters?.maxVotes?.toString() ?? '');
    setStartDateError('');
    setEndDateError('');
    setMinVotesError('');
    setMaxVotesError('');
  }, [initialFilters]);

  const tagOptions = [
    { value: 'all', label: 'All' },
    ...PREDEFINED_TAGS.map(tag => ({ value: tag, label: tag.charAt(0).toUpperCase() + tag.slice(1) }))
  ];

  const handleApply = () => {
    setStartDateError('');
    setEndDateError('');
    setMinVotesError('');
    setMaxVotesError('');

    let isValid = true;

    // Date validation
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setStartDateError('Start date must be before or equal to end date');
      isValid = false;
    }

    // Vote validation
    const minVotesNum = parseFloat(minVotes);
    const maxVotesNum = parseFloat(maxVotes);

    if (!isNaN(minVotesNum) && !isNaN(maxVotesNum) && minVotesNum > maxVotesNum) {
      setMinVotesError('Minimum votes must be less than or equal to maximum votes');
      isValid = false;
    }

    if (isValid && onApply) {
      const minVotesInt = parseInt(minVotes, 10);
      const parsedMinVotes = Number.isFinite(minVotesInt) ? Math.max(0, minVotesInt) : undefined;

      const maxVotesInt = parseInt(maxVotes, 10);
      const parsedMaxVotes = Number.isFinite(maxVotesInt) ? Math.max(0, maxVotesInt) : undefined;

      onApply({
        selectedTags,
        org,
        maintainer,
        onlyFeatured,
        startDate,
        endDate,
        minVotes: parsedMinVotes,
        maxVotes: parsedMaxVotes,
      });
    }
  };

  const hasErrors = !!startDateError || !!endDateError || !!minVotesError || !!maxVotesError;

  return (
    <Card className="space-y-4 p-4 border-none shadow-none bg-transparent">
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
            >
              {selectedTags.length > 0
                ? selectedTags.map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1)).join(", ")
                : "Select tags..."}
              <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0 bg-black/5 backdrop-blur-sm shadow-inner">
            <Command>
              <CommandInput placeholder="Search tags..." />
              <CommandEmpty>No tag found.</CommandEmpty>
              <CommandGroup>
                {PREDEFINED_TAGS.map((tag) => (
                  <CommandItem
                    key={tag}
                  >
                    <Checkbox
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={(checked) => {
                        setSelectedTags(
                          checked
                            ? [...selectedTags, tag]
                            : selectedTags.filter((t) => t !== tag)
                        );
                      }}
                      className="mr-2"
                    />
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <Label htmlFor="org">Organization</Label>
        <Input id="org" value={org} onChange={e => setOrg(e.target.value)} placeholder="e.g. vercel" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="maintainer">Maintainer</Label>
        <Input id="maintainer" value={maintainer} onChange={e => setMaintainer(e.target.value)} placeholder="e.g. johndoe" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="startDate">Start Date</Label>
        <Input id="startDate" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        {startDateError && <p className="text-red-500 text-sm mt-1">{startDateError}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="endDate">End Date</Label>
        <Input id="endDate" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        {endDateError && <p className="text-red-500 text-sm mt-1">{endDateError}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="minVotes">Minimum Votes</Label>
        <Input id="minVotes" type="number" min="0" value={minVotes} onChange={e => setMinVotes(e.target.value)} placeholder="e.g. 10" />
        {minVotesError && <p className="text-red-500 text-sm mt-1">{minVotesError}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="maxVotes">Maximum Votes</Label>
        <Input id="maxVotes" type="number" min="0" value={maxVotes} onChange={e => setMaxVotes(e.target.value)} placeholder="e.g. 100" />
        {maxVotesError && <p className="text-red-500 text-sm mt-1">{maxVotesError}</p>}
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
      <Button className="w-full mt-2" onClick={handleApply} disabled={hasErrors}>
        Apply Filters
      </Button>
    </Card>
  );
}
