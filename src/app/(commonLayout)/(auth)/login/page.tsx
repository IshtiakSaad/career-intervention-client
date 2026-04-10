import LoginForm from "@/components/auth/LoginForm";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const LoginPage = () => {
    return (
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center p-4">
            <Card className="w-full max-w-sm border-white/10 bg-brand-obsidian/40 backdrop-blur-xl shadow-2xl">
                <CardHeader className="space-y-1 text-center border-b border-white/5 pb-8 mb-6">
                    <CardTitle className="text-3xl font-black uppercase tracking-tight text-brand-acid">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground/80">
                        Please enter your credentials to access your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
                <CardFooter className="flex flex-col gap-4 border-t border-white/5 pt-6 mt-2">
                    <div className="text-sm text-muted-foreground text-center w-full">
                        Don't have an account?{" "}
                        <a
                            href="/register"
                            className={cn(
                                buttonVariants({ variant: "link" }),
                                "px-0 font-bold text-brand-acid hover:text-brand-acid/80"
                            )}
                        >
                            SIGN UP
                        </a>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginPage;