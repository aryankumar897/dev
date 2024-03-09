import Background from "@/components/Backgrounds/Background";
import SocialButton from "@/components/buttons/SocialButton";
import LoginForm from "@/components/forms/Login";
import RegisterForm from "@/components/forms/Register";
import { NextPageContext } from "next";
import { getCsrfToken, getProviders } from "next-auth/react";

export default function auth({
  tab,
  callbackUrl,
  csrfToken,
  providers,
}: {
  tab: string;
  callbackUrl: string;
  csrfToken: string;
  providers: any;
}) {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex items-center justify-center w-full h-100">
        {/*----Form----*/}
        <div className="flex flex-col items-center justify-center w-full h-full bg-white sm:w5/6 md:w-2/3 lg:w1/2 xl:w-1/3 2xl:w-1/3">
          {tab == "signin" ? (
            <LoginForm callbackUrl={callbackUrl} csrfToken={csrfToken} />
          ) : (
            <RegisterForm />
          )}
          <div className="flex items-center justify-between w-full px-12">
            <div className="w-full h-[1px] bg-gray-300"></div>
            <span className="mx-6 text-sm text-gray-400 uppercase">Or</span>
            <div className="w-full h-[1px] bg-gray-300"></div>
          </div>
          <div className="grid grid-cols-2 mt-3 gap-x-4 gap-y-2">
            {providers.map((provider: any) => {
              if (provider.name == "Credentials") return;
              return (
                <SocialButton
                  key={provider.id}
                  id={provider.id}
                  text={
                    tab == "signup"
                      ? `Sign up with ${provider.name}`
                      : `Signn in with ${provider.name}`
                  }
                  csrfToken={csrfToken}
                />
              );
            })}
          </div>
        </div>

        {/*--Background--*/}
        <Background
          image={`"../../auth/${tab == "signup" ? "register" : "login"}.jpg"`}
        />
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  const { req, query } = ctx;
  const tab = query.tab ? query.tab : "signin";
  const callbackUrl = query.callbackUrl
    ? query.callbackUrl
    : process.env.NEXTAUTH_URL;

  const csrfToken = await getCsrfToken(ctx);
  const providers = await getProviders();
  return {
    props: {
      providers: Object.values(providers!),
      tab: JSON.parse(JSON.stringify(tab)),
      callbackUrl,
      csrfToken,
    },
  };
}
