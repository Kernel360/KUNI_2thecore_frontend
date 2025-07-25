import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function DropDown() {
    return (
        <Select>
            <SelectTrigger className="w-[26%]" style={{ backgroundColor: "white", marginRight: "2%" }}>
                <SelectValue placeholder="전체 상태" className="bg-white" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="null">전체 상태</SelectItem> {/*백엔드로 보낼 때 "null"이 아니라 ""으로 보내야함 */}
                    <SelectItem value="IN_USE">운행중</SelectItem>
                    <SelectItem value="IDLE">대기중</SelectItem>
                    <SelectItem value="MAINTENANCE">점검중</SelectItem>

                </SelectGroup>
            </SelectContent>
        </ Select>
    )
}

export default DropDown;
