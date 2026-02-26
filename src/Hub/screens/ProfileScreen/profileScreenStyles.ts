import Color from "@/src/Common/constants/Color";
import { horizontalScale, moderateScale, verticalScale } from "@/src/Common/utils/dimensions";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    minHeight: "100%",
    backgroundColor: Color.White,
    borderRadius: moderateScale(10),
  },

  subContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  email: {
    paddingTop: verticalScale(15),
    fontWeight: 600,
    fontSize: moderateScale(22),
  },

  layoverEditScroll: {
    width: "100%",
  },

  input: {
    width: "86%",
    backgroundColor: Color.White,
    height: verticalScale(50),
    paddingLeft: horizontalScale(20),
    padding: moderateScale(5),
    borderRadius: moderateScale(10),
    fontWeight: 100,
    fontSize: moderateScale(20),
  },

  adminText: {
    fontSize: moderateScale(22),
    color: Color.Purple,
  },

  inputWrapper: {
    width: "100%",
    alignItems: "center",
    gap: verticalScale(8),
  },

  inputLabel: {
    paddingTop: verticalScale(20),
    width: "86%",
    fontSize: moderateScale(16),
    fontWeight: 500,
    color: Color.Black,
  },

  adminButton: {
    justifyContent: "center",
    alignItems: "center",
    width: horizontalScale(160),
    height: verticalScale(40),
    borderRadius: moderateScale(12),
    borderWidth: moderateScale(3),
    borderColor: Color.Purple,
  },

  loginButton: {
    width: "80%",
    height: verticalScale(50),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "gray",
  },

  loginButtonText: {
    fontSize: moderateScale(26),
    color: "black",
  },

  loggedIn: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  image: {
    width: horizontalScale(120),
    height: verticalScale(120),
  },

  imageCard: {
    marginTop: verticalScale(30),
    justifyContent: "flex-end",
    alignItems: "center",
    width: horizontalScale(140),
    height: verticalScale(140),
    borderRadius: moderateScale(28),
    backgroundColor: Color.Blue,
  },

  name: {
    paddingTop: verticalScale(15),
    fontSize: moderateScale(25),
    fontWeight: 600,
  },

  username: {
    paddingTop: verticalScale(5),
    fontSize: moderateScale(18),
  },

  editText: {
    fontSize: moderateScale(25),
    color: Color.Purple,
  },

  editButton: {
    marginTop: verticalScale(15),
    height: verticalScale(40),
    width: horizontalScale(205),
    borderRadius: moderateScale(10),
    borderColor: Color.Purple,
    borderWidth: moderateScale(2.5),
    justifyContent: "center",
    alignItems: "center",
  },

  layoverEdit: {
    width: "100%",
    height: "70%",
    backgroundColor: Color.LightGray,
    borderTopLeftRadius: moderateScale(50),
    borderTopRightRadius: moderateScale(50),
    marginTop: verticalScale(20),
  },

  layverPasswordEdit: {
    width: "100%",
    height: "55%",
    backgroundColor: Color.LightGray,
    borderTopLeftRadius: moderateScale(50),
    borderTopRightRadius: moderateScale(50),
    marginTop: verticalScale(20),
  },

  layoverEditContent: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: verticalScale(40),
  },

  layover: {
    width: "100%",
    height: "65%",
    backgroundColor: Color.LightGray,
    borderTopLeftRadius: moderateScale(50),
    borderTopRightRadius: moderateScale(50),
    marginTop: verticalScale(20),
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: verticalScale(40),
  },

  iconsBar: {
    position: "absolute",
    top: verticalScale(60),
    width: "95%",
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "row",
  },

  bigButton: {
    marginTop: verticalScale(30),
    width: "86%",
    height: verticalScale(60),
    borderRadius: moderateScale(15),
    alignItems: "center",
    justifyContent: "flex-start",
    display: "flex",
    flexDirection: "row",
  },

  iconGuard: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(10),
    backgroundColor: Color.White,
    width: horizontalScale(55),
    height: verticalScale(55),
  },

  buttonText: {
    flex: 1,
    paddingLeft: horizontalScale(15),
    fontSize: moderateScale(18),
    textAlign: "left",
  },

  crown: {
    height: verticalScale(70),
    width: horizontalScale(70),
    resizeMode: "cover",
  },

  buttonWrapper: {
    paddingTop: verticalScale(25),
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  buttonWrapperPassword: {
    gap: verticalScale(10),
    position: "absolute",
    bottom: verticalScale(40),
    paddingTop: verticalScale(25),
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  cancelButtonText: {
    fontSize: moderateScale(22),
    color: Color.Purple,
    fontWeight: 600,
  },

  cancelButton: {
    width: "46%",
    height: verticalScale(45),
    backgroundColor: Color.White,
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(3),
    borderColor: Color.Purple,
    justifyContent: "center",
    alignItems: "center",
  },

  cancelButtonPassword: {
    width: "43%",
    height: verticalScale(45),
    backgroundColor: Color.White,
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(3),
    borderColor: Color.Purple,
    justifyContent: "center",
    alignItems: "center",
  },

  saveButtonText: {
    fontSize: moderateScale(22),
    color: Color.White,
    fontWeight: 600,
  },

  saveButton: {
    width: "46%",
    height: verticalScale(45),
    backgroundColor: Color.Purple,
    borderRadius: moderateScale(10),
    borderColor: Color.White,
    justifyContent: "center",
    alignItems: "center",
  },

  saveButtonPassword: {
    width: "43%",
    height: verticalScale(45),
    backgroundColor: Color.Purple,
    borderRadius: moderateScale(10),
    borderColor: Color.White,
    justifyContent: "center",
    alignItems: "center",
  },

  genderButtonContainer: {
    width: "86%",
    height: verticalScale(60),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: horizontalScale(8),
  },

  genderButton: {
    flex: 1,
    height: verticalScale(50),
    backgroundColor: Color.White,
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(2),
    borderColor: Color.LightGray,
    justifyContent: "center",
    alignItems: "center",
  },

  genderButtonSelected: {
    borderColor: Color.Black,
  },

  genderButtonText: {
    fontSize: moderateScale(16),
    fontWeight: 400,
    color: Color.Black,
  },

  genderButtonTextSelected: {
    fontWeight: 600,
  },
});
