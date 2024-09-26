import React from 'react';
import { Link } from '@inertiajs/react';

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Chess Game</h1>
      <Link href="/chess">Start Playing</Link>
    </div>
  );
};

export default Home;
