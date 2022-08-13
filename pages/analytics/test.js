import { useRouter } from "next/router";
import Head from "next/head";
import Script from "next/script";
import Link from "next/link";
import dynamic from 'next/dynamic'



const DynamicPlot = dynamic(import('../../components/plot_CoP'), {
  ssr: false
})


const Analytics = () => {
  const router = useRouter();
  const { CL_bin, WB_bin } = router.query;
  console.log(router.query);
  return (
    <div>
      <Link href="/modetable/test">
        <a>Back to home</a>
      </Link>
      <p>
        Cooling Load and Wet Bulb Temp are in between {CL_bin}, {WB_bin} respectively
      </p>
      <DynamicPlot data={router.query}></DynamicPlot>
    </div>
  );
};

export default Analytics;
