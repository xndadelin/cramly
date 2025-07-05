export default function Signin() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <section className="container flex flex-col items-center justify-center py-24 text-center space-y-10">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                    Sign In to Cramly
                </h1>
                <p className="mx-auto max-w-[700px] text-lg md:text-xl">
                    Please enter your credentials to access your account.
                </p>
            </section>
        </div>
    );
}