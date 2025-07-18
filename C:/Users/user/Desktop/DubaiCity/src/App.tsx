import React, { useState, useEffect, useCallback, useMemo, useTransition, Suspense, lazy } from 'react';

const MyCity = lazy(() => import('./pages/MyCity'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const Projects = lazy(() => import('./pages/Projects'));
const AssetsPage = lazy(() => import('./pages/Assets'));
const CommunityPage = lazy(() => import('./pages/Community'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  return (
    <div>
      <h1>Dubai City</h1>
      <nav>
        <ul>
          <li><a href="#my-city">My City</a></li>
          <li><a href="#marketplace">Marketplace</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#assets">Assets</a></li>
          <li><a href="#community">Community</a></li>
          <li><a href="#profile">Profile</a></li>
        </ul>
      </nav>

      <Suspense fallback={<div>Loading...</div>}>
        <section id="my-city">
          <h2>My City</h2>
          <MyCity />
        </section>

        <section id="marketplace">
          <h2>Marketplace</h2>
          <Marketplace />
        </section>

        <section id="projects">
          <h2>Projects</h2>
          <Projects />
        </section>

        <section id="assets">
          <h2>Assets</h2>
          <AssetsPage />
        </section>

        <section id="community">
          <h2>Community</h2>
          <CommunityPage />
        </section>

        <section id="profile">
          <h2>Profile</h2>
          <Profile />
        </section>
      </Suspense>
    </div>
  );
}

export default App;