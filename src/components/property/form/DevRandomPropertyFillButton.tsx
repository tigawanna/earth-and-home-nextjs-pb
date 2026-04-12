"use client";

import { Button } from "@/components/ui/button";
import { isNodeEnvDevelopment } from "@/lib/env/dev-mode";
import { buildKenyanPropertyDevSeed } from "@/lib/property/kenyan-property-dev-seed";
import type { PropertyFormData } from "@/components/property/form/property-form-schema";
import { Sparkles } from "lucide-react";
import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

interface DevRandomPropertyFillButtonProps {
  agentId: string;
}

export function DevRandomPropertyFillButton({ agentId }: DevRandomPropertyFillButtonProps) {
  const form = useFormContext<PropertyFormData>();
  const seq = useRef(1);

  if (!isNodeEnvDevelopment()) {
    return null;
  }

  const fill = () => {
    const n = seq.current;
    seq.current += 1;
    const patch = buildKenyanPropertyDevSeed(n, agentId);
    const current = form.getValues();
    form.reset({
      ...current,
      ...patch,
      agent_id: agentId,
      image_url: "",
      images: [],
      featured_image_index: 0,
      video_url: "",
      virtual_tour_url: "",
    } as PropertyFormData);
    toast.success("Sample Kenyan listing filled (text only). Add your images, then publish.");
  };

  return (
    <Button type="button" variant="secondary" size="lg" className="gap-2" onClick={fill}>
      <Sparkles className="h-5 w-5" />
      Fill sample listing (dev)
    </Button>
  );
}
