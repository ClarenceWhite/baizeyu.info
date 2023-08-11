---
layout: post
title: "Arrays and Matrices"
categories: Java
date: 2023-02-10
image: "/assets/images/arrays_metrics.png"
excerpt:
reading_time: 20
---

# [Q283. Move Zeroes](https://leetcode.com/problems/move-zeroes/description/)

```java
class Solution {
    public void moveZeroes(int[] nums) {

        // An index for non zero numbers
        int none_zero_index = 0;

        // If we find none-zero values, just put it at index 'none_zero_index'
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] != 0) {
                nums[none_zero_index] = nums[i];
                none_zero_index ++;
            }
        }

        // if none_zero_index is not the same as nums.length, replace rest positions to 0
        if (none_zero_index != nums.length) {
            for (int i = none_zero_index; i < nums.length; i++) {
                nums[i] = 0;
            }
        }
    }
}
```

# [Q566. Reshape the Matrix](https://leetcode.com/problems/reshape-the-matrix/description/)

```java
class Solution {
    public int[][] matrixReshape(int[][] mat, int r, int c) {

        // get original number of rows and columns
        int row_original = mat.length;
        int column_original = mat[0].length;
        int size_original = row_original * column_original;

        // check if the given size is possible
        if (size_original != (r*c)) {
            return mat;
        }

        // else
        int[][] result = new int[r][c];

        // loop input matrix to get all numbers
        int[] all_nums = new int[size_original];
        int index = 0;
        for (int i = 0; i < row_original; i++) {
            for (int j = 0; j < column_original; j++) {
                int num = mat[i][j];
                all_nums[index] = num;
                index ++;
            }
        }

        // fill result matrix
        index = 0;
        for (int i = 0; i < r; i++) {
            for (int j = 0; j < c; j++) {
                result[i][j] = all_nums[index];
                index ++;
            }
        }

        return result;

    }
}
```

# [Q485. Max Consecutive Ones](https://leetcode.com/problems/max-consecutive-ones/description/)

```java
class Solution {
    public int findMaxConsecutiveOnes(int[] nums) {

        // count
        int count = 0;
        List<Integer> max_counts = new ArrayList<>();

        // loop over the array
        for (int i = 0; i < nums.length; i++) {
            if (i == nums.length-1 && nums[i] == 1) {
                count++;
                max_counts.add(count);
                break;
            }
            if (nums[i] == 1 && nums[i+1] == 1) {
                count++;
            } else if (nums[i] == 1 && nums[i+1] != 1) {
                count++;
            } else {
                max_counts.add(count);
                count = 0;
                continue;
            }
        }

        // get max in the list
        System.out.println(max_counts);
        int max = Collections.max(max_counts);

        return max;
    }
}
```

# [240. Search a 2D Matrix II](https://leetcode.com/problems/search-a-2d-matrix-ii/description/)

```java
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {

        // result
        boolean result = false;
        // check row by row, if the target is between first and last number
        for (int i = 0; i < matrix.length; i++) {

            // get row first and last
            int[] row = matrix[i];
            int first = row[0];
            int last = row[row.length-1];
            if (target >= first && target <=last) {
                for (int j = 0; j < row.length; j++) {
                    if (target == row[j]) {
                        result = true;
                    }
                }
            }
        }

        return result;
    }
}
```

# [378. Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/description/)

```java
class Solution {
    public int kthSmallest(int[][] matrix, int k) {

        List<Integer> expanded = new ArrayList<>();
        for (int i = 0; i < matrix.length; i++) {
            for (int j = 0; j < matrix[i].length; j++) {
                expanded.add(matrix[i][j]);
            }
        }

        // sort the list
        Collections.sort(expanded);

        // return
        return expanded.get(k-1);

    }
}
```

# [645. Set Mismatch](https://leetcode.com/problems/set-mismatch/description/)

```java
class Solution {
    public int[] findErrorNums(int[] nums) {

        // use a HashSet to find duplicates
        Set<Integer> nums_set = new HashSet<>();

        // result
        int dup = 0;
        int miss = 0;

        // find duplicate
        for (int i = 0; i < nums.length; i++) {
            if(nums_set.contains(nums[i])){
                dup = nums[i];
            }
            nums_set.add(nums[i]);
        }

        // find miss
        for (int i = 1; i < nums.length+1; i++) {
            if (!nums_set.contains(i)) {
                miss = i;
            }
        }

        // return
        return new int[]{dup, miss};
    }
}
```

# [287. Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/description/)

```java
class Solution {
    public int findDuplicate(int[] nums) {

        // use a HashSet
        Set<Integer> nums_set = new HashSet<>();
        for (int i = 0; i < nums.length; i++) {
            if (nums_set.contains(nums[i])) {
                return nums[i];
            }
            nums_set.add(nums[i]);
        }

        return -1;

    }
}
```
