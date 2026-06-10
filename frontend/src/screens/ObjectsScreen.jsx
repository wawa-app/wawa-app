import React from "react";
import {
    View,
    Text,
    ScrollView,
    Pressable,
} from "react-native";

import ObjectCard from "../components/ObjectCard.jsx";

const mockObjects = [
    {
        id: "1",
        objectName: "Coffee Mug",
        status: "Enrolled",
        date: "2026/04/01",
        imageUri: null,
    },
    {
        id: "2",
        objectName: "Coffee Mug",
        status: "Updated",
        date: "2026/04/01",
        imageUri: null,
    },
    {
        id: "3",
        objectName: "Coffee Mug",
        status: "Updated",
        date: "2026/04/01",
        imageUri: null,
    },
];

export default function ObjectsScreen() {
    return (
        <View className="flex-1 bg-white">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Top status/header mock area */}
                <View className="h-12 bg-white px-6 flex-row items-center justify-between">
                    <Text className="text-xs text-black">9:30</Text>
                    <View className="w-6 h-6 rounded-full bg-[#101010]" />
                    <Text className="text-base text-[#101010]">◢ ▮</Text>
                </View>

                {/* App header */}
                <View className="h-[52px] bg-black items-center justify-center">
                    <Text className="text-white text-[32px] leading-[39px] font-geologica-bold font-bold">
                        WaWa
                    </Text>
                </View>

                {/* Page title section */}
                <View className="bg-white px-4 py-6">
                    <Text className="text-[32px] leading-[39px] font-geologica-bold font-bold text-black">
                        Objects
                    </Text>

                    <Text className="text-xs text-black mt-1">
                        <Text className="font-geologica-bold font-bold">12 / 20</Text>{" "}
                        Enrolled (2 objects you need to check)
                    </Text>
                </View>

                {/* Must check section */}
                <View className="bg-[#D9D9D9] px-4 py-6">
                    <Text className="text-base font-geologica-bold font-bold text-black">
                        Are these objects still near you?
                    </Text>

                    <Text className="text-xs text-black mt-2 mb-4">
                        It looks like it's been over a month since the last update.
                    </Text>

                    <View className="gap-4 items-center">
                        {mockObjects.slice(0, 2).map((item) => (
                            <ObjectCard
                                key={item.id}
                                objectName={item.objectName}
                                status={item.status}
                                date={item.date}
                                imageUri={item.imageUri}
                                onMenuPress={() => console.log("Menu pressed:", item.id)}
                            />
                        ))}
                    </View>
                </View>

                {/* Normal objects list */}
                <View className="bg-white px-4 pt-6 gap-4 items-center">
                    {mockObjects.slice(2).map((item) => (
                        <ObjectCard
                            key={item.id}
                            objectName={item.objectName}
                            status={item.status}
                            date={item.date}
                            imageUri={item.imageUri}
                            onMenuPress={() => console.log("Menu pressed:", item.id)}
                        />
                    ))}
                </View>
            </ScrollView>

            {/* Floating add button */}
            <Pressable
                className="absolute right-6 bottom-[98px] w-[58px] h-[58px] rounded-full bg-[#101010] items-center justify-center z-10"
                onPress={() => console.log("Add object pressed")}
            >
                <Text className="text-white text-[32px] leading-[34px] font-light">
                    +
                </Text>
            </Pressable>
        </View>
    );
}