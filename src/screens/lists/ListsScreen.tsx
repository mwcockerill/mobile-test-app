import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';

const ITEMS = Array.from({ length: 50 }, (_, i) => i + 1);

export default function ListsScreen(): React.JSX.Element {
  const theme = useTheme();
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <View style={styles.container}>
      <Text testID="list-selection" style={[styles.selection, { color: theme.text }]}>
        {selected === null ? 'Selected: none' : `Selected: Item ${selected}`}
      </Text>
      <FlatList
        data={ITEMS}
        keyExtractor={n => String(n)}
        // Keep only rows near the screen in the view tree on both platforms,
        // so far-away rows really can't be found until you scroll to them.
        initialNumToRender={15}
        windowSize={3}
        removeClippedSubviews
        renderItem={({ item: n }) => (
          <Pressable
            testID={`list-item-${n}`}
            accessibilityRole="button"
            onPress={() => setSelected(n)}
            style={[styles.row, { borderColor: theme.mutedText }]}
          >
            <Text style={[styles.rowText, { color: theme.text }]}>{`Item ${n}`}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  selection: { fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 12 },
  row: { paddingVertical: 14, paddingHorizontal: 8, borderBottomWidth: StyleSheet.hairlineWidth },
  rowText: { fontSize: 16 },
});
