import { View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { styles } from "./categoryDropdownStyles";

interface CategoryItem<T = string> {
  label: string;
  value: T;
}

interface CategoryDropdownProps<T = string> {
  data: CategoryItem<T>[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
}

export const CategoryDropdown = <T extends string = string>({
  data,
  value,
  onChange,
  placeholder = "Velg categori",
  buttonBackgroundColor,
  buttonTextColor,
}: CategoryDropdownProps<T>) => {
  return (
    <Dropdown
      style={[styles.categoryButton, buttonBackgroundColor && { backgroundColor: buttonBackgroundColor }]}
      containerStyle={styles.dropdownContainer}
      itemContainerStyle={styles.dropdownItemContainer}
      itemTextStyle={styles.dropdownItemText}
      selectedTextStyle={[styles.selectedText, buttonTextColor && { color: buttonTextColor }]}
      placeholderStyle={[styles.selectedText, buttonTextColor && { color: buttonTextColor }]}
      data={data}
      labelField="label"
      valueField="value"
      placeholder={placeholder}
      value={value}
      onChange={(item) => onChange(item.value as T)}
      dropdownPosition="top"
      renderRightIcon={() => null}
      renderItem={(item) => (
        <View style={[styles.dropdownItem, buttonBackgroundColor && { backgroundColor: buttonBackgroundColor }]}>
          <Text style={[styles.bottomText, buttonTextColor && { color: buttonTextColor }]}>{item.label}</Text>
        </View>
      )}
    />
  );
};

export default CategoryDropdown;
