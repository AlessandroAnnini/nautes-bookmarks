const tags = process.env.NEXT_PUBLIC_TAGS_PIPE_SEPARATED;
console.log({ ct: tags.split('|') });

export const myTags = tags.split('|').map((t) => ({
  value: t,
  label: t,
}));
