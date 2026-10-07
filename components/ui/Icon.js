import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const MCI_PREFIX = 'mci:';

// Ionicons by default; `mci:<name>` selects MaterialCommunityIcons for the few
// glyphs Ionicons lacks (fuel pump, percent, ruler…).
export default function Icon({ name, size = 22, color }) {
  if (name.startsWith(MCI_PREFIX)) {
    return <MaterialCommunityIcons name={name.slice(MCI_PREFIX.length)} size={size} color={color} />;
  }
  return <Ionicons name={name} size={size} color={color} />;
}
