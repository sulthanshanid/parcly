import Images from "@/Images";
import Image from "next/image";

const Services = ({
  setOpenProfile,
  setCompleteModal,
  setGetModel,
  setstartModal,
}) => {
  const team = [
    {
      avatar: Images.compShipment,
    },
    {
      avatar: Images.getShipment,
    },
    {
      avatar: Images.startShipment,
    },
    {
      avatar: Images.userProfile,
    },
    {
      avatar: Images.shipCount,
    },
    {
      avatar: Images.send,
    },
  ];

  const openModelBox = (text) => {
    if (text === 1) {
      setCompleteModal(true);
    } else if (text === 2) {
      setGetModel(true);
    } else if (text === 3) {
      setstartModal(true);
    } else if (text === 4) {
      setOpenProfile(true);
    } else if (text === 5) {
      window.alert("Work in progress");
    } else if (text === 6) {
      window.alert("Work in progress");
    }
  };

  return (
    <section className="py-0 pb-14">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="mt-12">
          <ul className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {team.map((item, index) => (
              <li key={index}>
                <div
                  className="w-full h-60 sm:h-52 md:h-56 cursor-pointer"
                  onClick={() => openModelBox(index + 1)}
                >
                  <Image
                    src={item.avatar}
                    className="w-full h-full object-cover object-center shadow-md rounded-xl"
                    alt=""
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Services;
