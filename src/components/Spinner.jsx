
import { DotLoader } from "react-spinners";

const Spinner = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center"
        // style={{ minHeight: "300px" }}
    >
      <DotLoader
        color="#36d7b7"
        loading={true}
        size={60}
        aria-label="Loading movies"
      />
    </div>
  );
};

export default Spinner;
