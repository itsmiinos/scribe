import MaxWidthWrapper from "./components/MaxWidthWrapper";

export default function Home() {
  return (
    <MaxWidthWrapper className="mb-12 mt-28 sm:mt-30 flex flex-col items-center justify-center text-center">
      <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
        <p className="py-2 text-sm font-semibold text-gray-700">
          scribe is now public!
        </p>
      </div>
      <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
        Chat with your <span className="text-rose-500">documents</span> in
        seconds.
      </h1>
    </MaxWidthWrapper>
  );
}
