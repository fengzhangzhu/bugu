//分页返回时的分页信息
export interface PageInfo<T>{
	currentPageNum: number
	hasNext: boolean
	hasPrevious: boolean
	totalNum: number
	totalPages: number
	list:T[]
}