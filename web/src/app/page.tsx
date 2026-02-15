"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { demoStore, PostData } from "./demo-store";
import PostTile from "./feed/PostTile";
import { ALL_STYLES, getSubstylesForStyle, hasSubstyles } from "./data/styles";
import FilterDropdown from "./feed/FilterDropdown";
import { useAuth } from "./contexts/AuthContext";
import Sidebar from "./components/Sidebar";
import Logo from "./components/Logo";
import {
  MenuIcon,
  SearchIcon,
  HomeIcon,
  PlusIcon,
  UserIcon,
  StarIcon,
  GlobeIcon,
  ChevronRightIcon
} from "./components/Icons";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  // Prompt for username if it is still a placeholder (e.g. Google Login fallback)
  useEffect(() => {
    if (user?.is_placeholder_username) {
      router.push("/auth/setup");
    }
  }, [user, router]);

  const [activeTab, setActiveTab] = useState<'new' | 'top'>('new');
  const [styleFilter, setStyleFilter] = useState<string | null>(null);
  const [substyleFilter, setSubstyleFilter] = useState<string | null>(null);
  const [countryFilter, setCountryFilter] = useState<string | null>(null);

  // Data State
  const [allPosts, setAllPosts] = useState<PostData[]>([]);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initial Fetch
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const fetched = await demoStore.getAllPosts();
      setAllPosts(fetched);
      setLoading(false);
    };
    init();
  }, []);

  // STORY 5: Reset substyle when style changes
  const handleStyleChange = (newStyle: string | null) => {
    setStyleFilter(newStyle);
    setSubstyleFilter(null); // Always reset substyle
  };

  // Calculate Top Score (Async Wrapper)
  async function calculateTopScore(post: PostData): Promise<number> {
    const declaredVotes = await demoStore.getVoteCountForStyle(post.id, post.style);
    const hoursOld = (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);
    const timeDecay = 1 / Math.log10(hoursOld + 10);
    return declaredVotes * timeDecay;
  }

  // Filter and Sort Effect
  useEffect(() => {
    const applyFilters = async () => {
      let current = [...allPosts];

      // STORY 1 & STORY 4: Apply style filter
      if (styleFilter) {
        current = current.filter(p => p.style === styleFilter);
      }

      // STORY 4: Apply substyle filter
      if (styleFilter && substyleFilter) {
        current = current.filter(p => p.substyle === substyleFilter);
      }

      // Apply country filter
      if (countryFilter) {
        current = current.filter(p => p.countryName === countryFilter);
      }

      // Sort
      if (activeTab === 'new') {
        current.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else {
        // Top: calculate scores async
        const scored = await Promise.all(current.map(async p => ({
          post: p,
          score: await calculateTopScore(p)
        })));

        scored.sort((a, b) => b.score - a.score);
        current = scored.map(s => s.post);
      }

      setPosts(current);
    };

    if (!loading) {
      applyFilters();
    }
  }, [allPosts, activeTab, styleFilter, substyleFilter, countryFilter, loading]);

  // Get unique countries from ALL posts
  const countries = Array.from(new Set(
    allPosts
      .map(p => p.countryName)
      .filter((c): c is string => !!c && c !== 'Everywhere')
  )).sort();

  // STORY 3: Get substyles for selected style
  const availableSubstyles = styleFilter ? getSubstylesForStyle(styleFilter) : [];
  const showSubstyleFilter = styleFilter && hasSubstyles(styleFilter);

  return (
    <div className={styles.container}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Header */}
      <header className={styles.header}>
        <button className={styles.menuButton} onClick={() => setIsSidebarOpen(true)}><MenuIcon /></button>
        <div className={styles.logoContainer}>
          <Logo variant="full" size={64} />
        </div>
        <button className={styles.searchButton}><SearchIcon /></button>
      </header>

      {/* Tab Switcher */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'new' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('new')}
        >
          New
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'top' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('top')}
        >
          Top
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        {/* Row 1: Style and Location side-by-side */}
        <div className={styles.filterRow}>
          <FilterDropdown
            options={ALL_STYLES}
            selectedValue={styleFilter}
            onSelect={handleStyleChange}
            placeholder="Search Styles..."
            icon={
              <StarIcon
                className={styleFilter ? styles.starIconActive : styles.starIcon}
                filled={!!styleFilter}
              />
            }
            allLabel="All Styles"
            rightAction={styleFilter ? (
              <Link
                href={`/style/${styleFilter}`}
                className={styles.styleChevron}
                aria-label="Go to Style Page"
                onClick={(e) => e.stopPropagation()}
              >
                <ChevronRightIcon />
              </Link>
            ) : undefined}
          />

          <FilterDropdown
            options={countries}
            selectedValue={countryFilter}
            onSelect={setCountryFilter}
            placeholder="Search Countries..."
            icon={
              <GlobeIcon
                className={countryFilter ? styles.globeIconActive : styles.globeIcon}
              />
            }
            allLabel="Everywhere"
          />
        </div>

        {/* Row 2: Substyle (Conditional, Full Width) */}
        {showSubstyleFilter && (
          <div className={styles.filterFullWidth}>
            <FilterDropdown
              options={availableSubstyles}
              selectedValue={substyleFilter}
              onSelect={setSubstyleFilter}
              placeholder={`All ${styleFilter}`}
              icon={
                <StarIcon
                  className={substyleFilter ? styles.starIconActive : styles.starIcon}
                  filled={!!substyleFilter}
                />
              }
              allLabel={`All ${styleFilter}`}
            />
          </div>
        )}
      </div>

      {/* Post Grid */}
      <main className={styles.feedGrid}>
        {loading ? (
          <div className={styles.emptyState}>
            <p>Loading...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No posts match your filters</p>
            <button onClick={() => {
              setStyleFilter(null);
              setSubstyleFilter(null);
              setCountryFilter(null);
            }}>
              Clear Filters
            </button>
          </div>
        ) : (
          posts.map(post => (
            <PostTile
              key={post.id}
              post={post}
              onClick={() => router.push(`/post/${post.id}`)}
            />
          ))
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className={styles.navbar}>
        <div className={`${styles.navIcon} ${styles.navIconActive}`}><HomeIcon filled /></div>
        <Link href={user ? "/create" : "/auth/login"} className={styles.createButton}>
          <PlusIcon />
        </Link>
        <Link
          href={user ? `/profile/You` : "/auth/login"}
          className={styles.navIcon}
        >
          <UserIcon filled className={styles.navUserIcon} />
        </Link>
      </nav>
    </div>
  );
}
