import type { NewsArticle } from "@/types";
export type { NewsArticle };

export const mockNewsArticles: NewsArticle[] = [
  {
    id: "1",
    slug: "nytt-samarbete-med-malmo-stad",
    title: "Nytt samarbete med Malmö stad öppnar dörrar för fler unga",
    publishedAt: "2025-04-15",
    category: "samarbeten",
    excerpt:
      "Boost inleder ett nytt samarbete med Malmö stad som ger fler unga tillgång till arbetsmarknadsinsatser och vägledning.",
    body: "Boost by FC Rosengård inleder ett nytt och omfattande samarbete med Malmö stad. Syftet är att skapa fler vägar in i arbetslivet för unga i staden. Genom samarbetet får Boost utökade resurser för att nå ut till fler deltagare och erbjuda skräddarsytt stöd.\n\n- Det här samarbetet betyder oerhört mycket för oss och för de unga vi jobbar för, säger Anna Nettrup, projektledare på Boost.\n\nSamarbetet börjar gälla från och med juni 2025 och pågår initialt i två år.",
    imageUrl: "/images/Review.png",
    imageAlt: "Möte mellan Boost och Malmö stad",
    author: "Boost by FC Rosengård",
  },
  {
    id: "2",
    slug: "200-deltagare-fick-jobb-2024",
    title: "Över 200 deltagare fick jobb under 2024",
    publishedAt: "2025-03-20",
    category: "resultat",
    excerpt:
      "Fjärde året i rad levererar Boost starka resultat. Över 200 deltagare gick vidare till anställning under 2024.",
    body: "Under 2024 gick över 200 deltagare vidare från Boost till en anställning. Det är det fjärde året i rad som vi passerar 200-strecket.\n\nResultaten visar att modellen fungerar - individanpassat stöd, nära samarbete med arbetsgivare och ett helhetsperspektiv på varje persons situation.\n\nUtöver de som fick jobb började cirka 100 personer studera eller påbörjade en utbildning via Boost.",
    imageUrl: "/images/deltagare_boostbyfcr.jpg",
    imageAlt: "Deltagare firar nya jobb",
    author: "Boost by FC Rosengård",
  },
  {
    id: "3",
    slug: "bridge-by-fcr-ny-esf-satsning",
    title: "Bridge by FCR - ny ESF-satsning för unga",
    publishedAt: "2025-02-10",
    category: "projekt",
    excerpt:
      "EU:s Socialfond finansierar nytt intensivt program för unga som är inskrivna på Arbetsförmedlingen.",
    body: "Bridge by FCR är Boosts senaste tillskott - ett ESF-finansierat projekt för unga mellan 18 och 29 år som är inskrivna på Arbetsförmedlingen.\n\nProgrammet erbjuder intensivt och individanpassat stöd med personlig vägledare, CV- och intervjuträning samt direktkontakt med arbetsgivare.\n\n- Bridge fyller ett viktigt glapp. Vi finns här för de unga som annars faller mellan stolarna, säger Anna Nettrup.",
    imageUrl: "/images/Arbetssoekande2.jpg",
    imageAlt: "Workshop med deltagare i Bridge-programmet",
    author: "Boost by FC Rosengård",
  },
  {
    id: "4",
    slug: "forelasning-om-normer-pa-arbetsmarknaden",
    title: "Föreläsning: Normer på arbetsmarknaden",
    publishedAt: "2025-01-18",
    category: "team",
    excerpt:
      "Boosts team håller föreläsningar om hur normer och fördomar påverkar rekrytering och arbetsliv.",
    body: "Hur påverkar osynliga normer vem som får jobbet? Det var temat när Boosts team höll en föreläsning för arbetsgivare i Malmö.\n\nFöreläsningen var en del av Boosts arbete med att sprida kunskap om inkluderande rekrytering och att utmana de normer som ofta styr arbetsmarknaden.\n\nIntresset var stort och flera företag har redan bokat in uppföljande workshops.",
    imageUrl: "/images/Haelsospaaret2.jpeg",
    imageAlt: "Föreläsning om normer",
    author: "Boost by FC Rosengård",
  },
];

import type { TimelineEntry } from "@/types";
export type { TimelineEntry };

export const mockTimeline: TimelineEntry[] = [
  {
    id: "tl-1",
    year: 2003,
    projectName: "Boost grundades som del av FC Rosengård",
    description:
      "Allt började med en vision om att använda fotbollens kraft för att skapa möjligheter för unga i Malmö.",
  },
  {
    id: "tl-2",
    year: 2005,
    projectName: "Första arbetsmarknadsprojektet",
    description:
      "Startade det första riktade projektet för att hjälpa unga in i arbete eller studier.",
    funder: "Allmänna Arvsfonden",
  },
  {
    id: "tl-3",
    year: 2010,
    projectName: "Samarbete med Malmö stad",
    description:
      "Inledde ett långsiktigt samarbete med Malmö stad för arbetsmarknadsinsatser.",
  },
  {
    id: "tl-4",
    year: 2015,
    projectName: "Expansion till tre spår",
    description:
      "Verksamheten växte och delades in i tre spår: Arbete, Studier och Hälsa.",
  },
  {
    id: "tl-5",
    year: 2018,
    projectName: "ESF-finansierat projekt startar",
    description:
      "Fick första stora EU-finansieringen genom Socialfonden för intensifierat arbetsmarknadsstöd.",
    funder: "EU Socialfonden",
  },
  {
    id: "tl-6",
    year: 2020,
    projectName: "200+ deltagare får jobb per år",
    description:
      "För första gången passerade 200 deltagare gränsen till anställning under ett och samma år.",
  },
  {
    id: "tl-7",
    year: 2023,
    projectName: "20-årsjubileum",
    description:
      "Boost firade 20 år av att skapa förändring. Tusentals unga hade gått vidare till jobb och studier.",
  },
  {
    id: "tl-8",
    year: 2025,
    projectName: "Bridge by FCR lanseras",
    description:
      "Nytt ESF-projekt lanserades med intensivt stöd för unga inskrivna på Arbetsförmedlingen.",
    funder: "EU Socialfonden",
  },
];

import type { Resource } from "@/types";
export type { Resource };

export const mockResources: Resource[] = [
  {
    id: "r-1",
    title: "Guide till arbetsmarknaden",
    slug: "guide-arbetsmarknaden",
    category: "arbetsmarknad",
    description:
      "En praktisk guide för dig som vill förstå hur den svenska arbetsmarknaden fungerar och hur du navigerar den.",
    fileUrl: "/files/guide-arbetsmarknaden.pdf",
    fileName: "guide-arbetsmarknaden.pdf",
    fileSize: 2_400_000,
    fileType: "PDF",
    isPublic: true,
  },
  {
    id: "r-2",
    title: "CV-mall - Steg för steg",
    slug: "cv-mall",
    category: "arbetsmarknad",
    description:
      "Vår populäraste CV-mall med instruktioner för varje sektion. Används av hundratals deltagare varje år.",
    fileUrl: "/files/cv-mall.pdf",
    fileName: "cv-mall.pdf",
    fileSize: 800_000,
    fileType: "PDF",
    isPublic: true,
  },
  {
    id: "r-3",
    title: "Normmedveten rekrytering - Handbok",
    slug: "normmedveten-rekrytering",
    category: "normer",
    description:
      "Handbok för arbetsgivare som vill rekrytera mer inkluderande. Baserad på Boosts 20 år av erfarenhet.",
    fileUrl: "/files/normmedveten-rekrytering.pdf",
    fileName: "normmedveten-rekrytering.pdf",
    fileSize: 3_100_000,
    fileType: "PDF",
    isPublic: true,
  },
  {
    id: "r-4",
    title: "Hälsa och välmående - Övningshäfte",
    slug: "halsa-ovningshaefte",
    category: "halsa",
    description:
      "Praktiska övningar för stresshantering, sömn och fysisk aktivitet. Taggade med Boosts hälsoteam.",
    fileUrl: "/files/halsa-ovningshaefte.pdf",
    fileName: "halsa-ovningshaefte.pdf",
    fileSize: 1_500_000,
    fileType: "PDF",
    isPublic: true,
  },
  {
    id: "r-5",
    title: "Intervjuteknik - Tips och tricks",
    slug: "intervjuteknik",
    category: "arbetsmarknad",
    description:
      "Konkreta tips inför jobbintervju. Vanliga frågor, hur du svarar och vad du ska tänka på.",
    fileUrl: "/files/intervjuteknik.pdf",
    fileName: "intervjuteknik.pdf",
    fileSize: 600_000,
    fileType: "PDF",
    isPublic: true,
  },
  {
    id: "r-6",
    title: "Projektplanering för idéburna organisationer",
    slug: "projektplanering",
    category: "handbocker",
    description:
      "Handbok för hur du planerar, genomför och utvärderar projekt. Skriven utifrån Boosts egna erfarenheter.",
    fileUrl: "/files/projektplanering.pdf",
    fileName: "projektplanering.pdf",
    fileSize: 4_200_000,
    fileType: "PDF",
    isPublic: true,
  },
];
