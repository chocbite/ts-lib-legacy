import state from "@chocbite/ts-lib-state";
import { array_from_length } from "./array";
import { FETCH_PARSE, make_fetch_parser } from "./fetch_parse";

let zxcv = 0;
let abc = 0;
window.fetch = async (e, i) => {
  console.warn(e, i);
  return Promise.resolve(
    new Response(
      JSON.stringify({
        test: true,
        then: zxcv++,
        arr_fixed: [1, 2, 3],
        arr_dyn: array_from_length(abc++, (i) => i),
        obj: { test: false },
      }),
    ),
  );
};

const yo = make_fetch_parser(() => "/test", 2000, {
  test: "?b",
  then: "n",
  arr_fixed: [3, "n"],
  arr_dyn: [0, "n"],
  obj: {
    test: "?b",
  },
});

yo[FETCH_PARSE].then((v) => {
  console.warn(v);
});

yo.test.then((v) => {
  console.warn(v);
});

yo.then.sub((v) => {
  console.warn(v);
});

yo.obj[FETCH_PARSE].then((v) => {
  console.warn(v);
});

yo.obj.test.then((v) => {
  console.warn(v);
});

yo.arr_fixed[1][FETCH_PARSE].then((v) => {
  console.warn(v);
});

yo.arr_dyn.then((v) => {
  console.warn(v);
  state.a.read(v).forEach((arr) => {
    console.warn(arr);
    switch (arr.type) {
      case "added":
        arr.items.forEach((item) => {
          console.warn(item);
          item[FETCH_PARSE].then((v) => {
            console.warn(v);
          });
        });
    }
  });
});
