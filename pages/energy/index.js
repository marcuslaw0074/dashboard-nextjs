import { useRouter } from "next/router";
import Head from "next/head";
import Script from "next/script";
import Link from "next/link";
import dynamic from "next/dynamic";

const DynamicPlot = dynamic(import("../../components/energy"), {
  ssr: false,
});

const energy = () => {
  const router = useRouter();
  const { chillerNo } = router.query;

  return (
    <div>
      <Link href="/modetable">
        <a>Back to Mode Table</a>
      </Link>
      <p>
        Chiller: {chillerNo}
      </p>
      <DynamicPlot chillerNo={router.query}></DynamicPlot>
    </div>
  );
};

export default energy;
