import { useRouter } from "next/router";
import Head from "next/head";
import Script from "next/script";
import Link from "next/link";

const Analytics = () => {
  const router = useRouter();
  const { coolingload, wetbulb } = router.query;
  console.log(router.query);
  return (
    <div>
      <Link href="/modetable/test">
        <a>Back to home</a>
      </Link>
      <p>
        Cooling Load and Wet Bulb Temp are in between {coolingload}, {wetbulb} respectively
      </p>
    </div>
  );
};

export default Analytics;
