interface TagProps {
  children: string;
}

export function Tag(props: TagProps) {
  return (
    <span class="px-2 py-1 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm">
      {props.children}
    </span>
  );
}
