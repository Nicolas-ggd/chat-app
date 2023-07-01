
export const Features = () => {

    const featuresData = [
        {
            icon: '💡',
            id: 1,
            name: 'Real-Time Messaging',
            description: 'Enable users to exchange messages instantly in real-time, ensuring a smooth and seamless chat experience.'
        },
        {
            icon: '🔨',
            id: 2,
            name: 'Message Read Receipts',
            description: 'Provide users with the ability to see when their messages have been read by the recipients, ensuring transparency and indicating active engagement.'
        },
        {
            icon: '⚙️',
            id: 3,
            name: 'User Presence Status',
            description: 'Display the online/offline status of users in the chat interface, allowing participants to know when others are available for a conversation, fostering better communication.'
        }
    ];

    return (
        <div className="py-10 px-20 flex justify-center items-center">
            {featuresData && featuresData?.map((item, index) => {
                return (
                    <a key={index} href="#" className="block mx-2 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex flex-col justify-between h-[300px]">
                        <div className="flex">
                            <button className="bg-gray-100 text-white font-bold py-4 px-4 rounded text-2xl">{item?.icon}</button>
                        </div>
                        <div className="flex flex-col justify-between h-full">
                            <div>
                                <h5 className="pt-5 mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{item?.name}</h5>
                                <p className="font-normal text-gray-700 dark:text-gray-400">{item?.description}</p>
                            </div>
                        </div>
                    </a>
                );
            })}
        </div>
    );
};