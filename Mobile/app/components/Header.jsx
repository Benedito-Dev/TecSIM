import { TouchableOpacity, View, Text } from "react-native";
import { ArrowLeft } from "lucide-react-native";

export default function Header({ title, onBack }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack}>
        <ArrowLeft size={24} color="#2563EB" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.headerRight} />
    </View>
  );
}
