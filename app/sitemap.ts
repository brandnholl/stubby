import { type MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://stbby.link/",
      lastModified: new Date(),
    },
  ];
}
