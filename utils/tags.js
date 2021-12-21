const myTags = process.env.NEXT_PUBLIC_TAGS_PIPE_SEPARATED;

export const tags = myTags.split('|').map((t) => ({
  value: t,
  label: t,
}));
