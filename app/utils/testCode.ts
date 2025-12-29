/**
 * 測試代碼常量（與後端 orderly_refer/src/api/test_data.py 保持一致）
 *
 * ⚠️ TODO: 上 production 前需要恢復環境檢查
 */
export const TEST_CODE = "10TEST01";

/**
 * 檢查是否為測試代碼
 * @param code 要檢查的 referral code
 * @returns 是否為測試代碼
 */
export const isTestCodeInDevMode = (code: string): boolean => {
  // TODO: 上 production 前恢復環境檢查
  // return process.env.NODE_ENV === "development" &&
  //   process.env.DEBUG === "true" &&
  //   code.toUpperCase() === TEST_CODE;
  return code.toUpperCase() === TEST_CODE;
};
