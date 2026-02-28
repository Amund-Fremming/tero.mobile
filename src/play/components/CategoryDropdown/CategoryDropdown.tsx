import { View, Text, Keyboard } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { styles } from "./categoryDropdownStyles";
import { useRef } from "react";

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
  onOpen?: () => void;
}

export const CategoryDropdown = <T extends string = string>({
  data,
  value,
  onChange,
  placeholder = "Velg categori",
  buttonBackgroundColor,
  buttonTextColor,
  onOpen,
}: CategoryDropdownProps<T>) => {
  const dropdownRef = useRef<any>(null);

  const handleFocus = () => {
    if (Keyboard.isVisible()) {
      Keyboard.dismiss();
      const unsub = Keyboard.addListener("keyboardDidHide", () => {
        unsub.remove();
        dropdownRef.current?.open();
      });
    }
    onOpen?.();
  };

  return (
    <Dropdown
      ref={dropdownRef}
      style={[styles.categoryButton, buttonBackgroundColor && { backgroundColor: buttonBackgroundColor }]}
      containerStyle={styles.dropdownContainer}
      itemContainerStyle={styles.dropdownItemContainer}
      itemTextStyle={styles.dropdownItemText}
      selectedTextStyle={[styles.selectedText, buttonTextColor && { color: buttonTextColor }]}
      placeholderStyle={[styles.selectedText, buttonTextColor && { color: buttonTextColor }]}
      data={data}
      maxHeight={10000}
      labelField="label"
      valueField="value"
      placeholder={placeholder}
      value={value}
      onChange={(item) => onChange(item.value as T)}
      onFocus={handleFocus}
      dropdownPosition="top"
      activeColor="transparent"
      renderRightIcon={() => null}
      renderItem={(item, selected) => (
        <View
          style={[
            styles.dropdownItem,
            buttonBackgroundColor && { backgroundColor: buttonBackgroundColor },
            selected && styles.dropdownItemSelected,
          ]}
        >
          <Text style={[styles.bottomText, buttonTextColor && { color: buttonTextColor }]}>{item.label}</Text>
        </View>
      )}
    />
  );
};

export default CategoryDropdown;
