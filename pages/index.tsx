import Link from "next/link";
import Head from "next/head";
import { useUser } from "@auth0/nextjs-auth0/client";
import { GetServerSidePropsContext } from "next";
import { getSession } from "@auth0/nextjs-auth0";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const { isLoading, error, user } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div>
      <Head>
        <title>WrenChat - Login or Signup</title>
      </Head>

      <div className="flex h-[calc(100vh-var(--height-gap))] w-full items-center 
        justify-center text-center text-white
        bg-gradient-to-t from-gray-950 to-gray-600">
        <div>
          <div>
            <FontAwesomeIcon
              icon={faRobot}
              className="mb-2 text-6xl text-emerald-300"
            />
          </div>
          <h1 className="text-4xl">Welcome to WrenChat!</h1>
          <p className="my-2 text-lg">
            Login with your account to start chatting!
          </p>
          <div className="flex items-center justify-center">
            {!user && (
              <div className="flex justify-center gap-4">
                <Link href="/api/auth/login" className="btn">
                  Login
                </Link>
                <Link href="/api/auth/signup" className="btn">
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context.req, context.res);
  if (session) {
    return {
      redirect: {
        destination: "/chat",
        permanent: false,
      },
    };
  }
  return { props: {} };
};

// export const getServerSideProps = async (context) => {
//   const session = await getSession(context.req, context.res);
//   if (session) {
//     return {
//       redirect: {
//         destination: "/chat",
//         permanent: false,
//       },
//     };
//   }
//   return { props: {} };
// };
