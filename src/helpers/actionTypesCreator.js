export default function actionTypesCreator(actionTypeName) {
  return {
    REQUEST: `${actionTypeName}_REQUEST`,
    SUCCESS: `${actionTypeName}_SUCCESS`,
    FAILURE: `${actionTypeName}_FAILURE`,
  };
}

