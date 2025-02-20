"use client";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFeather } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/app/_hooks/useAuth";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const router = useRouter();
  const { isLoading, session } = useAuth();
  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <header>
      <div className="bg-slate-800 py-2">
        <div
          className={twMerge(
            "mx-4 max-w-2xl md:mx-auto",
            "flex items-center justify-between",
            "text-lg font-bold text-white"
          )}
        >
          <div>
            <Link href="/">
              <FontAwesomeIcon icon={faFeather} className="mr-1" />
              BlogApp
            </Link>
          </div>
          <nav>
            <ul className="flex gap-x-6">
              <li>
                {!isLoading &&
                  (session ? (
                    <button onClick={logout}>
                      Logout
                      <FontAwesomeIcon
                        icon={faArrowRightFromBracket}
                        className="ml-1"
                      />
                    </button>
                  ) : (
                    <Link href="/login">
                      Login
                      <FontAwesomeIcon
                        icon={faArrowRightToBracket}
                        className="ml-1"
                      />
                    </Link>
                  ))}
              </li>
              <li>
                <Link href="/about">
                  About
                  <FontAwesomeIcon icon={faUser} className="ml-1" />
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
