import { useRouter } from "next/router";
import Head from "next/head";
import Script from "next/script";
import Link from "next/link";
import dynamic from 'next/dynamic'



const DynamicPlot = dynamic(import('../../components/analytics'), {
  ssr: false
})


const Analytics = () => {
  const router = useRouter();
  const { cL_Bin, wB_Bin } = router.query;
  // console.log(router.query);
  return (
    <div>
      <Link href="/modetable">
        <a>Back to Mode Table</a>
      </Link>
      <p>
        Cooling Load and Wet Bulb Temp are in between {cL_Bin}, {wB_Bin} respectively
      </p>
      <DynamicPlot data={router.query}></DynamicPlot>
    </div>
  );
};

export default Analytics;
