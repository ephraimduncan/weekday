import { RiMoreFill } from "@remixicon/react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export default function Participants() {
  return (
    <div className="flex -space-x-[0.45rem]">
      <Image
        className="ring-background rounded-full ring-1"
        alt="Avatar 01"
        height={24}
        src="https://res.cloudinary.com/dlzlfasou/image/upload/v1738342643/avatar-40-16_zn3ygb.jpg"
        width={24}
      />
      <Image
        className="ring-background rounded-full ring-1"
        alt="Avatar 02"
        height={24}
        src="https://res.cloudinary.com/dlzlfasou/image/upload/v1738342643/avatar-40-10_qyybkj.jpg"
        width={24}
      />
      <Image
        className="ring-background rounded-full ring-1"
        alt="Avatar 03"
        height={24}
        src="https://res.cloudinary.com/dlzlfasou/image/upload/v1738342643/avatar-40-15_fguzbs.jpg"
        width={24}
      />
      <Image
        className="ring-background rounded-full ring-1"
        alt="Avatar 04"
        height={24}
        src="https://res.cloudinary.com/dlzlfasou/image/upload/v1738342644/avatar-40-11_jtjhsp.jpg"
        width={24}
      />
      <Button
        size="icon"
        variant="outline"
        className="flex size-6 items-center justify-center rounded-full text-xs ring-1 ring-background border-transparent shadow-none text-muted-foreground/80 dark:bg-background dark:hover:bg-background dark:border-transparent"
      >
        <RiMoreFill size={16} className="size-4" />
      </Button>
    </div>
  );
}
