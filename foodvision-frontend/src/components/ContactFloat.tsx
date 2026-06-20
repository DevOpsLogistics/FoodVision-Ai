import Image from "next/image";
import { SOCIAL } from "@/data/socialLinks";

export default function ContactFloat() {
  return (
    <div className="fixed left-4 bottom-20 md:bottom-8 z-40 flex flex-col gap-4">
      <a
        href={SOCIAL.hotlineUrl}
        className="contact-float-btn contact-float-btn--phone shadow-lg"
        aria-label="Gọi hotline"
      >
        <Image
          src="/logos/phone-call.svg"
          alt=""
          width={52}
          height={52}
          className="h-full w-full object-cover"
          aria-hidden
        />
      </a>

      <a
        href={SOCIAL.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="contact-float-btn contact-float-btn--zalo shadow-lg"
        aria-label="Chat Zalo"
      >
        <Image
          src="/logos/zalo.svg"
          alt=""
          width={52}
          height={52}
          className="h-full w-full object-cover"
          aria-hidden
        />
      </a>
    </div>
  );
}
