import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const BlogPosts = ({ posts }: { posts: any[] }) => {
  return (
    <>
      <section>
        <div className="container max-w-5xl space-y-4 text-center">
          <h1 className="text-2xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
            Blog
          </h1>

          <p className="text-muted-foreground max-w-md leading-snug font-medium lg:mx-auto">
            Explore our blog for insightful articles, personal reflections and
            more.
          </p>
        </div>
      </section>
      <section className="container flex max-w-5xl flex-col-reverse gap-8 md:gap-14 lg:flex-row lg:items-end">
        <div className="container">
          <div className="mt-20 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <a
                key={post.id}
                className="rounded-xl border"
                href={`/blog/${post.id}/`}
              >
                <div className="p-2">
                  <img
                    src={post.data.image}
                    alt="placeholder"
                    className="aspect-video w-full rounded-lg object-cover"
                  />
                </div>
                <div className="px-3 pt-2 pb-4">
                  <h2 className="mb-1 font-semibold">{post.data.title}</h2>
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {post.data.description}
                  </p>
                  <Separator className="my-5" />
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="ring-input size-7 rounded-full ring-1">
                        <AvatarImage
                          src={post.data.authorImage}
                          alt="placeholder"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {post.data.authorName}
                      </span>
                    </div>
                    <Badge variant="secondary" className="h-fit">
                      10 Min Read
                    </Badge>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export { BlogPosts };
