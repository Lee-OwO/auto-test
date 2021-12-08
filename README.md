# auto-test demo

## -s [path]

- source 文件夹路径

## -o [path]

- output 文件夹路径,生成的测试代码会放到此文件夹下

## -i [type]

- type: gen | test
  > gen: 跳过代码生成流程;
  > test: 跳过测试流程

### example

```
yarn auto-test -s ./src/utils -o ./tests/unit -i test

```
