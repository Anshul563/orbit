"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { updateProfile } from "./actions";
import { Loader2, X, Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SKILLS_LIST } from "@/lib/skills-data"; // Import your new data file

interface ProfileFormProps {
  initialData: {
    name: string;
    university: string | null;
    bio: string | null;
    skillsOffered: string[] | null;
    skillsWanted: string[] | null;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // State for Skills
  const [offered, setOffered] = useState<string[]>(initialData.skillsOffered || []);
  const [wanted, setWanted] = useState<string[]>(initialData.skillsWanted || []);
  
  // State for Popovers (Open/Close)
  const [openOffered, setOpenOffered] = useState(false);
  const [openWanted, setOpenWanted] = useState(false);

  const toggleSkill = (skill: string, list: string[], setList: (v: string[]) => void) => {
    if (list.includes(skill)) {
      setList(list.filter((s) => s !== skill));
    } else {
      if (list.length >= 10) return; // Limit to 10 skills
      setList([...list, skill]);
    }
  };

  const removeSkill = (skill: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.filter((s) => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    formData.set("skillsOffered", offered.join(","));
    formData.set("skillsWanted", wanted.join(","));

    try {
      await updateProfile(formData);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reusable Skill Selector Component
  const SkillSelector = ({ 
    selected, 
    setSelected, 
    open, 
    setOpen, 
    label,
    colorClass
  }: { 
    selected: string[], 
    setSelected: (v: string[]) => void, 
    open: boolean, 
    setOpen: (v: boolean) => void,
    label: string,
    colorClass: string
  }) => (
    <div className={`space-y-3 p-4 border rounded-lg ${colorClass}`}>
      <div className="space-y-1">
          <Label className="font-semibold">{label}</Label>
          <p className="text-xs text-slate-500">Select up to 10 skills.</p>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white"
          >
            {selected.length > 0 
              ? `${selected.length} skills selected` 
              : "Search & add skills..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search framework, tool, or role..." />
            <CommandList className="max-h-[300px] overflow-auto">
              <CommandEmpty>No skill found.</CommandEmpty>
              {SKILLS_LIST.map((group) => (
                <CommandGroup key={group.category} heading={group.category}>
                  {group.items.map((skill) => (
                    <CommandItem
                      key={skill}
                      value={skill}
                      onSelect={() => toggleSkill(skill, selected, setSelected)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selected.includes(skill) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {skill}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Tags Display */}
      <div className="flex flex-wrap gap-2 min-h-[40px]">
        {selected.map((skill) => (
          <Badge 
            key={skill} 
            variant="secondary" 
            className="bg-white border shadow-sm pl-2 pr-1 py-1 flex items-center gap-1"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill, selected, setSelected)}
              className="hover:bg-slate-200 rounded-full p-0.5 transition"
            >
              <X className="h-3 w-3 text-slate-500" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* Basic Info Inputs */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" defaultValue={initialData.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="university">University / College</Label>
          <Input 
            id="university" 
            name="university" 
            placeholder="e.g. MIT, Stanford" 
            defaultValue={initialData.university || ""} 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea 
          id="bio" 
          name="bio" 
          placeholder="Tell us about your major, interests, and what you're building..." 
          defaultValue={initialData.bio || ""}
          className="h-24"
        />
      </div>

      {/* NEW: SEARCHABLE SKILLS SECTION */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Superpowers (Blue Theme) */}
        <SkillSelector 
          label="⚡ Superpowers (Offering)"
          colorClass="bg-blue-50/50 border-blue-100 text-blue-900"
          selected={offered}
          setSelected={setOffered}
          open={openOffered}
          setOpen={setOpenOffered}
        />

        {/* Needs (Orange Theme) */}
        <SkillSelector 
          label="🎯 Needs (Looking For)"
          colorClass="bg-orange-50/50 border-orange-100 text-orange-900"
          selected={wanted}
          setSelected={setWanted}
          open={openWanted}
          setOpen={setOpenWanted}
        />

      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Profile
        </Button>
      </div>
    </form>
  );
}