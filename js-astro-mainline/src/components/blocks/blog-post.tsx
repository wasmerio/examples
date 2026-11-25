import { format } from "date-fns";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
const BlogPost = ({
  post,
  children,
}: {
  post: any[];
  children: React.ReactNode;
}) => {
  const { title, authorName, image, pubDate, description, authorImage } =
    post.data;
  return (
    <section>
      <div className="container">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
          <h1 className="max-w-3xl text-4xl font-bold md:text-5xl">{title}</h1>
          <h3 className="text-muted-foreground max-w-4xl">{description}</h3>
          <div className="flex items-center gap-3 text-sm md:text-base">
            <Avatar className="h-8 w-8 border">
              <AvatarImage src={authorImage} />
              <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>
              <a href="#" className="font-semibold">
                {authorName}
              </a>
              <span className="ml-1">on {format(pubDate, "MMMM d, yyyy")}</span>
            </span>
          </div>
          <img
            src={image}
            alt="placeholder"
            className="mt-0 mb-8 aspect-video w-full rounded-lg border object-cover"
          />
        </div>
      </div>
      <div className="container">
        <div className="prose mx-auto max-w-3xl">{children}</div>
      </div>
    </section>
  );
};

export { BlogPost };
