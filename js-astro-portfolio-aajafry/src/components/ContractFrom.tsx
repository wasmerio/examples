import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Label } from "@/shadcn/components/ui/label";
import { Textarea } from "@/shadcn/components/ui/textarea";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ContactForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm();

    const onSubmit = async (data: Object) => {
        toast("toast!")
        console.log("Form Submitted:", data);
        reset();
    };

    return (
        <div className="group p-6 h-auto rounded-sm shadow hover:shadow-md bg-slate-50 dark:bg-slate-900">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
            >
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                    Get Into Touch
                </h2>

                {/* Name Field */}
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        autoComplete="off"
                        placeholder="Enter your name"
                        {...register("name", { required: "Name is required" })}
                        className="focus-visible:ring-rose-500"
                    />
                    {errors.name && (
                        <p className="text-red-600" role="alert">{String(errors.name.message)}</p>
                    )}
                </div>
                {/* Phone Field */}
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        type="tel"
                        autoComplete="off"
                        placeholder="Enter your phone number"
                        {...register("phone", { required: "Phone number is required" })}
                        className="focus-visible:ring-rose-500"
                    />
                    {errors.phone && (
                        <p className="text-red-600" role="alert">{String(errors.phone.message)}</p>
                    )}
                </div>


                {/* Email Field */}
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        autoComplete="off"
                        placeholder="Enter your email"
                        {...register("email", { required: "Email is required" })}
                        className="focus-visible:ring-rose-500"
                    />
                    {errors.email && (
                        <p className="text-red-600" role="alert">{String(errors.email.message)}</p>
                    )}
                </div>

                {/* Subject Field */}
                <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                        id="subject"
                        type="text"
                        autoComplete="off"
                        placeholder="Enter the subject"
                        {...register("subject", { required: "Subject is required" })}
                        className="focus-visible:ring-rose-500"
                    />
                    {errors.subject && (
                        <p className="text-red-600" role="alert">{String(errors.subject.message)}</p>
                    )}
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                        id="message"
                        rows={4}
                        autoComplete="off"
                        placeholder="Write your message here"
                        {...register("message", { required: "Message is required" })}
                        className="focus-visible:ring-rose-500"
                    />
                    {errors.message && (
                        <p className="text-red-600" role="alert">{String(errors.message.message)}</p>
                    )}
                </div>

                {/* Submit Button */}
                <div>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        aria-busy={isSubmitting}
                        className="w-full mt-4 bg-rose-500 hover:bg-rose-600 text-white font-medium py-3 rounded-md transition-all duration-300"
                    >
                        <Mail className="h-5 w-5 transition-all duration-300" aria-hidden="true" />
                        {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ContactForm;
