import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Award, Target, Users } from 'lucide-react';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface HeroTilesProps {
  userId: string;
}

interface TileData {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

export default function HeroTiles({ userId }: HeroTilesProps) {
  const [tileData, setTileData] = useState<TileData[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchTileData() {
      try {
        const { data, error } = await supabase
          .from("hero_tiles")
          .select("*")
          .eq("user_id", userId);

        if (error) throw error;

        const formattedData: TileData[] = data.map((item) => ({
          title: item.title,
          value: item.value,
          icon: getIconComponent(item.icon),
          color: item.color,
        }));

        setTileData(formattedData);
      } catch (error) {
        console.error("Error fetching hero tile data:", error);
      }
    }

    fetchTileData();
  }, [userId, supabase]);

  function getIconComponent(iconName: string): React.ElementType {
    switch (iconName) {
      case "Book":
        return Book;
      case "Award":
        return Award;
      case "Target":
        return Target;
      case "Users":
        return Users;
      default:
        return Book;
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {tileData.map((tile, index) => (
        <motion.div
          key={tile.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className={`${tile.color} text-white`}>
              <CardTitle className="flex items-center justify-between">
                {tile.title}
                <tile.icon className="w-6 h-6" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-center">{tile.value}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

