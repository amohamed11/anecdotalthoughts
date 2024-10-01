import type { TinaField } from "tinacms";
export function blog_postFields() {
  return [
    {
      type: "string",
      name: "title",
      label: "title",
    },
    {
      type: "string",
      name: "description",
      label: "description",
    },
    {
      type: "datetime",
      name: "date",
      label: "date",
    },
    {
      type: "string",
      name: "tags",
      label: "tags",
      list: true,
    },
  ] as TinaField[];
}
