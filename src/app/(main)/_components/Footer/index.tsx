"use client";

import './style.scss';
import Image from "next/image";
import homeIcon from "./home.svg";
import mybetsIcon from "./mybets.svg";
import userIcon from "./user.svg";
import favoriteIcon from "./favorite.svg";
import leaderboardIcon from "./leaderboard-icon.svg";

import { usePathname } from "next/navigation";
import { pages } from "@/lib/constants/ui";
import Link from "next/link";
import useAppContext from "@/lib/hooks/useAppContext";
import { Badge } from "@mui/material";
import { useAccount } from 'wagmi';

export default function Footer() {
  const pathname = usePathname();
  const {
    data: { positions, favorites },
  } = useAppContext();

  const account = useAccount();

  const selected = (path: string) => {
    return pathname === path ? "selected" : "";
  };

  return (
    <div className="j-footer filter-root">
      <Link
        href={pages.scheduled.path}
        className={`footer-button ${selected(pages.scheduled.path)}`}
      >
        <Image src={homeIcon} alt="" />
      </Link>
      <Badge
        color="secondary"
        badgeContent={favorites.length > 0 ? favorites.length : ""}
        invisible={favorites.length === 0}
        sx={{ ".MuiBadge-badge": { right: "5px", top: "5px" } }}
      >
        <Link
          href={pages.favorite.path}
          className={`footer-button ${selected(pages.favorite.path)}`}
        >
          <Image src={favoriteIcon} alt="" />
        </Link>
      </Badge>
      <Badge
        color="secondary"
        badgeContent={positions.length > 0 ? positions.length : ""}
        invisible={positions.length === 0}
        sx={{ ".MuiBadge-badge": { right: "5px", top: "5px" } }}
      >
        <Link
          href={pages.betslip.path}
          className={`footer-button ${selected(pages.betslip.path)}`}
        >
          <Image src={mybetsIcon} alt="" />
        </Link>
      </Badge>
      <Link
        href={pages.mybets.path}
        className={`footer-button ${selected(pages.mybets.path)}`}
      >
        <Image src={userIcon} alt="" />
      </Link>
      <Link
        href={pages.leaderboard.path}
        className={`footer-button ${selected(pages.leaderboard.path)}`}
      >
        <Image src={leaderboardIcon} alt="" />
      </Link>
    </div>
  );
}
