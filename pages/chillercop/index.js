import { useRouter } from "next/router";
import Head from "next/head";
import Script from "next/script";
import Link from "next/link";
import dynamic from "next/dynamic";

const DynamicPlot = dynamic(import("../../components/ChillerCoP"), {
  ssr: false,
});

const Chiller = () => {
  const router = useRouter();
  const { measurement } = router.query;
  // console.log(router.query);
  return (
    <div>
      <Link href="/modetable">
        <a>Back to Mode Table</a>
      </Link>
      <p>
        Chiller: {measurement}
      </p>
      <DynamicPlot measurement={router.query}></DynamicPlot>
    </div>
  );
};

export default Chiller;
