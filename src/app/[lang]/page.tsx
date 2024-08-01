import Image from "next/image";
import { localize, type Locale } from "@/lib/locale";
import { getDictionary } from "@/lib/get-dictionary";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function HomePage({
  params: { lang }
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  return (
    <div className="flex min-h-screen flex-col items-center">
      <section
        className="flex flex-col items-center justify-center space-y-8 pt-4 sm:pt-24 w-full bg-[url('/images/hero-bg-pattern-light.svg')] dark:bg-[url('/images/hero-bg-pattern-dark.svg')]"
        id="hero"
      >
        <h1 className="font-robotoSlab text-4xl font-medium text-center tracking-tighter sm:text-5xl md:text-6xl leading-6">
          {dictionary["/"]["header:hero-title"]}
        </h1>
        <p className="font-roboto max-w-[600px] mt-4 text-center text-muted-foreground md:text-xl">
          {dictionary["/"]["header:hero-subtitle-1"]}
          <br />
          {dictionary["/"]["header:hero-subtitle-2"]}
        </p>
        {/* TODO: CTA */}
        <Link href={localize(lang, "/dashboard")}>
          <Button size="lg" className="gap-2 text-white text-lg bg-gradient-to-r from-indigo-400 to-cyan-400">
            {dictionary["/"]["button:get-started"]}
          </Button>
        </Link>
        <div className="w-full h-24 bg-gradient-to-b from-transparent to-background"></div>
      </section>
      <section
        className="flex flex-col items-center justify-center space-y-4 mt-12 pb-24"
        id="features"
      >
        <h2 className="mb-10 font-robotoSlab text-3xl text-center tracking-tighter sm:text-4xl md:text-5xl">
          {dictionary["/"]["header:how-it-works"]}
        </h2>
        <ul className=" grid gap-4 grid-cols-1 md:gridcols-2 lg:grid-cols-4 w-full max-w-7xl text-center">
          <li className="flex flex-col  items-center space-y-4 relative">
            <Image
              src="/images/app/1-create-form.png"
              width="250"
              height="250"
              alt={dictionary["/"]["image.alt:create-form"]}
              className="bg-white p-4 shadow-sm border rounded-md"
            />
            <Image
              src="/images/arrow.svg"
              width="125"
              height="125"
              alt="arrow"
              className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10 rtl:rotate-180 rtl:-translate-x-[200%]"
            />
            <p>{dictionary["/"]["card.desc:create-form"]}</p>
          </li>
          <li className="flex flex-col items-center space-y-4 relative">
            <Image
              src="/images/app/2-drag-element.png"
              width="250"
              height="250"
              alt={dictionary["/"]["image.alt:add-elements"]}
              className="bg-white p-4 shadow-sm border rounded-md"
            />
            <Image
              src="/images/arrow.svg"
              width="125"
              height="125"
              alt="arrow"
              className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 scale-x-[-1] rotate-180 z-10 rtl:scale-x-[1] rtl:-translate-x-[200%]"
            />
            <p>{dictionary["/"]["card.desc:add-elements"]}</p>
          </li>
          <li className="flex flex-col items-center space-y-4 relative">
            <Image
              src="/images/app/3-edit-element.png"
              width="250"
              height="250"
              alt={dictionary["/"]["image.alt:configure-form"]}
              className="bg-white p-4 shadow-sm border rounded-md"
            />
            <Image
              src="/images/arrow.svg"
              width="125"
              height="125"
              alt="arrow"
              className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10 rtl:rotate-180 rtl:-translate-x-[200%]"
            />
            <p>{dictionary["/"]["card.desc:configure-form"]}</p>
          </li>
          <li className="flex flex-col items-center space-y-4 relative">
            <Image
              src="/images/app/4-form-published.png"
              width="250"
              height="250"
              alt={dictionary["/"]["image.alt:publish-form"]}
              className="bg-white p-4 shadow-sm border rounded-md"
            />
            <p>{dictionary["/"]["card.desc:publish-form"]}</p>
          </li>
        </ul>
      </section>
    </div>
  );
}
